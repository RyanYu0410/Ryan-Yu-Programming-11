#include <Adafruit_CircuitPlayground.h>
#include <math.h>  // For the sqrt function

float wave_threshold = 30;  // Lowered sensitivity threshold for 3D movement (adjustable)
float hit_sound_duration = 400;  // Duration in milliseconds (adjustable)
int min_pitch = 300;  // Minimum pitch frequency (in Hz)
int max_pitch = 1000; // Maximum pitch frequency (in Hz)
bool is_active = false;  // Whether the sound is active

float prev_x = 0;
float prev_y = 0;
float prev_z = 0;

// Variables for tracking
float max_distance = 0;  // Store the furthest distance in a session
int total_hits = 0;      // Total number of hits
unsigned long session_start_time = 0;  // Time when the system was activated
unsigned long session_end_time = 0;    // Time when the system was deactivated
bool session_active = false;           // Track if a session is currently active
int highest_sound_pitch = 0;  // Variable to store the highest sound pitch during the session

void setup() {
  CircuitPlayground.begin();
  Serial.begin(9600);
  
  // Print CSV header
  Serial.println("Time (ms), Furthest Distance, Highest Sound Pitch, Hits per Min, Total Hits");
}

void loop() {
  // Check if left button (Button A) is pressed to activate sounds
  if (CircuitPlayground.leftButton()) {
    if (!session_active) {  // Only activate if a session isn't already running
      is_active = true;
      session_active = true;
      session_start_time = millis();  // Log the start time
      max_distance = 0;               // Reset max distance
      total_hits = 0;                 // Reset hit count
      highest_sound_pitch = 0;        // Reset highest pitch
      Serial.println("Sound system activated!");
      
      // Turn all lights to green when activated
      for (int i = 0; i < 10; i++) {
        CircuitPlayground.setPixelColor(i, 0, 255, 0);  // Green color
      }
    }
  }

  // Check if right button (Button B) is pressed to deactivate sounds
  if (CircuitPlayground.rightButton()) {
    if (session_active) {  // Only deactivate if the session is active
      is_active = false;
      session_active = false;
      session_end_time = millis() / 1000;  // Log the end time
      float session_duration = (session_end_time - session_start_time) / 60000.0;  // Calculate time in minutes
      float hits_per_min = total_hits / session_duration;  // Hits per minute

      // Output the recorded data in CSV format
      Serial.print(session_end_time);  // Time in milliseconds
      Serial.print(", ");
      Serial.print(max_distance);  // Furthest distance
      Serial.print(", ");
      Serial.print(highest_sound_pitch);  // Highest played sound pitch
      Serial.print(", ");
      Serial.print(hits_per_min);  // Hits per minute
      Serial.print(", ");
      Serial.println(total_hits);  // Total hit count

      Serial.println("Sound system deactivated!");
      
      // Turn all lights to red when deactivated
      for (int i = 0; i < 10; i++) {
        CircuitPlayground.setPixelColor(i, 255, 0, 0);  // Red color
      }
    }
  }

  // If sound system is active, detect fist wave based on 3D movement and play sound
  if (is_active) {
    float x = CircuitPlayground.motionX();
    float y = CircuitPlayground.motionY();
    float z = CircuitPlayground.motionZ();

    // Calculate the 3D distance (Euclidean distance)
    float distance = sqrt(sq(x - prev_x) + sq(y - prev_y) + sq(z - prev_z));
    Serial.println(distance);

    if (distance > max_distance) {
      max_distance = distance;
    }

    prev_x = x;
    prev_y = y;
    prev_z = z;

    // Check if the 3D movement exceeds the wave threshold
    if (distance > wave_threshold) {
      // Map the distance to a frequency range (min_pitch to max_pitch)
      int pitch = map(distance, wave_threshold, wave_threshold * 1.5, min_pitch, max_pitch);  // Adjusted to make higher pitches easier to achieve
      pitch = constrain(pitch, min_pitch, max_pitch);  // Ensure pitch stays within limits

      // Check if this is the highest pitch and update
      if (pitch > highest_sound_pitch) {
        highest_sound_pitch = pitch;
      }

      // Play the sound with pitch based on distance
      CircuitPlayground.playTone(pitch, hit_sound_duration);
      total_hits++;  // Increment the hit counter

      // Light up LEDs based on pitch speed
      int num_lights = map(pitch, min_pitch, max_pitch, 0, 10);  // Map pitch to number of lights

      // Animate the white light increase
      for (int brightness = 0; brightness <= 255; brightness += 5) {
        for (int i = 0; i < num_lights; i++) {
          CircuitPlayground.setPixelColor(i, brightness, brightness, brightness);  // Set lights to white progressively
        }
        delay(5);  // Delay for smooth animation
      }

      delay(100);  // Keep the white lights for 0.2 seconds

      // Animate transition back to green
      for (int brightness = 255; brightness >= 0; brightness -= 5) {
        for (int i = 0; i < num_lights; i++) {
          CircuitPlayground.setPixelColor(i, 0, brightness, 0);  // Gradually revert lights to green
        }
        delay(5);  // Delay for smooth animation
      }

      // After animation, make sure all lights are green again
      for (int i = 0; i < 10; i++) {
        CircuitPlayground.setPixelColor(i, 0, 255, 0);  // All green
      }
    }
  }

  delay(100);  // Small delay to avoid detecting too frequently
}
