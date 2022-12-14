// MQTT client details:
let broker = {
  hostname: "23.21.151.236",
  port: 9001, //for website
  protocol: "mqtt",
};

// MQTT client:
let client;
let connected = false;

// helper function to create unique identifier for client
//https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

// client credentials:
let creds = {
  clientID: "p5Client_" + uuidv4(),
};

// called when the client connects
function onConnect() {
  console.log("client connected");
  connected = true;
  // once connected will subscribe to our topic
  // # is a wildcard that subscribes us to any topic that starts with sva/
  client.subscribe("esp32/sub");
}

// called when the client loses its connection
function onConnectionLost(response) {
  console.log("client not connected");
}

// called when a message arrives
function onMessageArrived(message) {
  console.log("message arrived");
  // this is the topic
  console.log(message.destinationName);
  // this is the message payload
  console.log("message as string: ", message.payloadString);
  // we can convert our string into a json obj
  const obj = JSON.parse(message.payloadString);
  console.log("message as JSON obj", obj);
}

function setup() {
  // createCanvas(400, 400);
  console.log(creds);
  // assign a value to our client variable
  client = new Paho.MQTT.Client(
    broker.hostname,
    Number(broker.port),
    creds.clientID
  );
  // set callback handlers for the client:
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;
  // connect to the MQTT broker:
  client.connect({
    onSuccess: onConnect, // callback function for when you connect
  });


  button = createButton("Happy");
  button.addClass('happy')
  button.mousePressed(greetZero);

  button = createButton("Sad");
  button.addClass('sad')
  button.mousePressed(greetOne);

  button = createButton("Meh");
  button.addClass('meh')
  button.mousePressed(greetTwo);

  textAlign(CENTER);
  textSize(50);
 
}

function greetZero() {
  message = {
    "  ledControl  ": "0"
  }

  if (connected) {
    client.send('esp32/sub', JSON.stringify(message))
  }
  console.log(message)
}

function greetOne(){
  message = {
    "  ledControl  ": "1"
  }

  if (connected) {
    client.send('esp32/sub', JSON.stringify(message))
  }
  console.log(message)
}

function greetTwo(){
  message = {
    "  ledControl  ": "2"
  }

  if (connected) {
    client.send('esp32/sub', JSON.stringify(message))
  }
  console.log(message)
}

function draw() {}