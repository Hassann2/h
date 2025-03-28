import tkinter as tk
from win32api import GetSystemMetrics

class Calculator:
    def __init__(self, master):
        self.master = master
        master.title("Calculator")
        master.configure(bg="#2E2E2E")

        # Set the minimum and maximum window size
        master.minsize(300, 400)  
        self.max_width = GetSystemMetrics(0)
        self.max_height = GetSystemMetrics(1)
        master.maxsize(self.max_width, self.max_height)  

        # Grid setup for scaling
        master.grid_rowconfigure(0, weight=1)
        for i in range(1, 7):
            master.grid_rowconfigure(i, weight=1)
        for j in range(5):
            master.grid_columnconfigure(j, weight=1)
        
        self.entry = tk.Entry(master, font=('Arial', 24), borderwidth=2, relief="solid", bg="#FFFFFF", fg="#000000", cursor="")
        self.entry.bindtags(("all"))
        self.entry.grid(row=0, column=0, columnspan=5, padx=10, pady=10, sticky="nsew")
        
        self.create_buttons()

        # Add an event for the Escape key to exit fullscreen mode
        master.bind("<Escape>", self.toggle_fullscreen)
        self.fullscreen = False
        master.bind("<Configure>", self.on_resize)

    def create_buttons(self):
        buttons = [
            '7', '8', '9', '/',
            '4', '5', '6', '*',
            '1', '2', '3', '-',
            '0', '.', '=', '+',
            'C'
        ]
    
        for i, button in enumerate(buttons):
            row = (i // 4) + 1
            column = i % 4
            tk.Button(self.master, text=button, font=('Arial', 18),
                      bg="#4CAF50", fg="#FFFFFF", activebackground="#45a049",
                      cursor="hand2",
                      command=lambda b=button: self.press_button(b)).grid(row=row, column=column, padx=5, pady=5, sticky="nsew")

    def on_resize(self, event):
        # Check if the window is maximized
        if self.master.winfo_width() >= self.max_width and self.master.winfo_height() >= self.max_height:
            if self.master.winfo_width() >= self.master.winfo_screenwidth() and self.master.winfo_height() >= self.master.winfo_screenheight():
                self.toggle_fullscreen()
        elif self.master.winfo_width() < self.max_width and self.master.winfo_height() < self.max_height:
            if self.fullscreen:
                self.toggle_fullscreen()

    def toggle_fullscreen(self, event=None):
        self.fullscreen = not self.fullscreen
        self.master.attributes("-fullscreen", self.fullscreen)

        if self.fullscreen:
            # Hide the title bar and window size
            self.master.overrideredirect(True)
            self.master.geometry(f"{self.master.winfo_screenwidth()}x{self.master.winfo_screenheight()}+0+0")
        else:
            # Restore maximum size and show title bar
            self.master.overrideredirect(False)
            self.master.geometry(f"{self.max_width}x{self.max_height}+0+0")

    def press_button(self, button):
        if button == '=':
            try:
                expression = self.entry.get()
                result = str(eval(expression))
                self.entry.delete(0, tk.END)
                self.entry.insert(0, result)
            except Exception as e:
                self.entry.delete(0, tk.END)
                self.entry.insert(0, "Error")
        elif button == 'C':
            self.clear()
        else:
            self.entry.insert(tk.END, button)

    def clear(self):
        self.entry.delete(0, tk.END)

if __name__ == "__main__":
    root = tk.Tk()
    calculator = Calculator(root)
    root.mainloop()
