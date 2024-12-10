import tkinter as tk
from tkinter import *
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
        
        
        self.entrata = tk.Entry(master, font=('Arial', 24), borderwidth=2, relief="solid", bg="#FFFFFF", fg="#000000", cursor="")
        self.entrata.bindtags(("all"))
        self.entrata.grid(row=0, column=0, columnspan=5, padx=10, pady=10, sticky="nsew")
        
        self.crea_pulsanti()

        # Add an event for the Escape key to exit fullscreen mode
        master.bind("<Escape>", self.toggle_fullscreen)

        self.fullscreen = False

        master.bind("<Configure>", self.on_resize)

    def crea_pulsanti(self):
        pulsanti = [
            '7', '8', '9', '/',
            '4', '5', '6', '*',
            '1', '2', '3', '-',
            '0', '.', '=', '+',
            'C'
        ]
    
        for i, pulsante in enumerate(pulsanti):
                riga = (i // 4) + 1
                colonna = i % 4
                tk.Button(self.master, text=pulsante, font=('Arial', 18),
                          bg="#4CAF50", fg="#FFFFFF", activebackground="#45a049",
                          cursor="hand2",
                          command=lambda p=pulsante: self.premi_pulsante(p)).grid(row=riga, column=colonna, padx=5, pady=5, sticky="nsew")

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

    def premi_pulsante(self, pulsante):
        if pulsante == '=':
            try:
                espressione = self.entrata.get()
                risultato = str(eval(espressione))
                self.entrata.delete(0, tk.END)
                self.entrata.insert(0, risultato)
            except Exception as e:
                self.entrata.delete(0, tk.END)
                self.entrata.insert(0, "Errore")
        elif pulsante == 'C':
            self.cancella()
        else:
            self.entrata.insert(tk.END, pulsante)

    def cancella(self):
        self.entrata.delete(0, tk.END)

if __name__ == "__main__":
    root = tk.Tk()
    img = PhotoImage(file='Calculator-icon.png')
    calculator = Calculator(root)
    root.iconphoto(False, img)
    root.mainloop()


