//SERIAL
var serial; // variable to hold an instance of the serialport library
var portName = "/dev/tty.usbserial-1130"; // fill in your serial port name here
var outByte = "<" + 3 + ">"; // for outgoing data

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
  serial.write(message.payloadString);

  // const obj = (message.payloadString);
  // console.log("message as obj", obj);
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

  //SERIAL
  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on("error", serialError); // callback for errors
  serial.on("list", printList); // set a callback function for the serialport list event
  serial.list(); // list the serial ports
  serial.open(portName); // open a serial port

  button = createButton("Happy");
  button.addClass("happy");
  button.mousePressed(greetZero);

  button = createButton("Sad");
  button.addClass("sad");
  button.mousePressed(greetOne);

  button = createButton("Meh");
  button.addClass("meh");
  button.mousePressed(greetTwo);
}

function greetZero() {
  // message = {
  //   "  ledControl  ": "0",
  // };

  outByte = "<" + 0 + ">";

  if (connected) {
    // client.send("esp32/sub", JSON.stringify(message));
    client.send("esp32/sub", outByte);
  }

  serial.write(outByte);
  // console.log(message);
  console.log(outByte);
}

function greetOne() {

  outByte = "<" + 1 + ">";

  if (connected) {
    client.send("esp32/sub", outByte);
  }

  serial.write(outByte);
  console.log(outByte);
}

function greetTwo() {
  if (connected) {
    client.send("esp32/sub", outByte);
  }

  outByte = "<" + 2 + ">";
  serial.write(outByte);
  console.log(outByte);
}

function draw() {}

function serialError(err) {
  console.log("Something went wrong with the serial port. " + err);
}

// get the list of ports:
function printList(portList) {
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    console.log("port " + i + ": " + portList[i]);
  }
}