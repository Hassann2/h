<strong>To build the circuit you will need those components:</strong>
<li>Arduino board (any board, if you don’t have Uno you can easily adapt by finding corresponding pins).</li>
<li>Breadboard.</li>
<li>LED – any color.</li>
<li>Push button.</li>
<li>220 Ohm resistor for the LED. If you don’t have this specific value, any resistor from 330 to 1k Ohm will do.</li>
<li>10k Ohm resistor for the push button. If you don’t have, you can go until 20k-50k Ohm.</li>
<li>A bunch of male to male wires (including if possible black, red, and other colors).</li>
<br>
<strong>Here’s the circuit you have to make:</strong>
<br>
<br>
<img src="arduino_led_push_button-1024x505.png">
<br>
<strong>Step by step instructions to build the circuit:</strong>
<br>
<br>
<li>First, make sure to power off your Arduino – remove any USB cable.</li>
<li>Plug a black wire between the blue line of the breadboard and a ground (GND) pin on the Arduino board.</li>
<li>Plug the LED. You can notice that the LED has a leg shorter than the other. Plug this shorter leg to the ground (blue line here) of the circuit.</li>
<li>Connect the longer leg of the LED to a digital pin (here pin no 8, you can change it). Add a 220 Ohm resistor in between to limit the current going through the LED.</li>
<li>Add the push button to the breadboard, like in the picture.</li>
<li>Connect one leg of the button to the ground, and put a 10k Ohm resistor in between. This resistor will act as a “pull down” resistor, which means that the default button’s state will be LOW.</li>
<li>Add a red wire between another leg of the button and VCC (5V).</li>
<li>Finally, connect a leg of the button (same side as the pull down resistor) to a digital pin (here 7)</li>
<br>
<strong>For the code click here:</strong>
<br>
<br>
<strong>This is the link for the video tutorial:</strong><a href="https://youtu.be/ZoaUlquC6x8" target="_blank">Link</a>
