// Configurar el SDK de AWS
AWS.config.region = 'us-east-1'; // Reemplaza 'REGION' con la región de tu DynamoDB
AWS.config.credentials = new AWS.Credentials('AKIAW3MECCLU3QM5PEND', '6TIfTdaJ+T0ogW5QJKtoQWFOx3VoAC0DlvgHaN+B'); // Reemplaza con tus credenciales

var dynamodb = new AWS.DynamoDB();

function sendQuestion() {
    var question = document.getElementById('questionInput').value.trim();

    // Parámetros de la consulta
    var params = {
        TableName: 'Preguntas',
        FilterExpression: 'Pregunta = :question',
        ExpressionAttributeValues: {
            ':question': { S: question }
        }
    };

    dynamodb.scan(params, function(err, data) {
        if (err) {
            console.error('Error al escanear DynamoDB:', err);
        } else {
            if (data.Items.length > 0) {
                // Se encontró la pregunta, mostrar la respuesta
                var answer = data.Items[0].Respuesta.S;
                document.getElementById('answerDisplay').innerHTML = '<p><strong>Respuesta:</strong> ' + answer + '</p>';
            } else {
                // La pregunta no se encontró en la base de datos
                var userResponse = prompt('La pregunta no se encontró en la base de datos. Por favor, ingresa la respuesta:');
                if (userResponse !== null && userResponse.trim() !== '') {
                    // Obtener el último ID utilizado en la tabla y generar el siguiente
                    getNextId(function(nextId) {
                        // Almacena la pregunta y la respuesta ingresadas por el usuario en la base de datos
                        var putParams = {
                            TableName: 'Preguntas', // Reemplaza 'Preguntas' con el nombre de tu tabla en DynamoDB
                            Item: {
                                'ID': { N: nextId.toString() }, // Convertir el ID a un Cadena y pasarlo como 'N'
                                'Pregunta': { S: question },
                                'Respuesta': { S: userResponse }
                            }
                        };

                        dynamodb.putItem(putParams, function(err, data) {
                            if (err) {
                                console.error('Error al almacenar la respuesta en DynamoDB:', err);
                            } else {
                                console.log('La respuesta se almacenó correctamente en la base de datos.');
                                document.getElementById('answerDisplay').innerHTML = '<p><strong>Respuesta:</strong> ' + userResponse + '</p>';
                            }
                        });
                    });
                } else {
                    // El usuario no proporcionó una respuesta
                    document.getElementById('answerDisplay').innerHTML = '<p>No se proporcionó una respuesta.</p>';
                }
            }
        }
    });
}

// Función para obtener el siguiente ID disponible
function getNextId(callback) {
    var params = {
        TableName: 'Preguntas',  // Reemplaza 'Preguntas' con el nombre de tu tabla en DynamoDB
        ProjectionExpression: 'ID'
    };

    dynamodb.scan(params, function(err, data) {
        if (err) {
            console.error('Error al obtener el siguiente ID de DynamoDB:', err);
            callback(null);
        } else {
            var nextId = 1;

            if (data.Items.length > 0) {
                // Encontrar el máximo ID existente y agregar 1
                nextId = Math.max(...data.Items.map(item => parseInt(item.ID.N))) + 1;
            }

            callback(nextId);
        }
    });
}


