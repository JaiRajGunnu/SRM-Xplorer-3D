# SRM Xplorer 3D

SRM Xplorer 3D is an interactive navigation web application for SRM University. This project utilizes **Mapbox** and **React.js** to provide precise 3D navigation and enhance the campus exploration experience.

## 🚀 Features
- **3D Indoor Navigation**: Navigate through SRM University with accurate indoor positioning.
- **Custom Map Integration**: Interactive 3D maps with real-time location tracking.
- **Info**: Displays additional location information when interacting with the map.

## 🛠️ Tech Stack
- **Frontend**: React.js, Tailwind CSS
- **Mapping & Navigation**: Mapbox GL JS
- **State Management**: Context API
- **Styling**: Tailwind CSS

## 📂 Project Structure
```
SRMLOCUS/
│── public/               # Static assets
│   ├── img/              # Images and icons
│   ├── index.html        # Main HTML file
│   ├── manifest.json     # Web app manifest
│── src/                  # Source files
│   ├── components/       # React components
│   │   ├── FloorSelector.js   # Floor switching functionality
│   │   ├── MapContext.js      # Context API for map state
│   │   ├── MapView.js         # Main 3D map rendering
│   │   ├── ModalPopup.css     # Popup styles
│   │   ├── Navbar.js          # Navigation bar
│   ├── data/             # JSON data for campus locations
│   ├── App.js            # Main App component
│   ├── index.js          # Entry point
│── .env.local            # Environment variables
│── package.json          # Project dependencies
│── README.md             # Project documentation
```

## 🚀 Installation & Setup
1. **Clone the repository:**
   ```sh
   git clone https://github.com/JaiRajGunnu/SRM-Xplorer-3D.git
   cd srm-xplorer-3d
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up environment variables:**
   - Create a `.env.local` file.
   - Add your **Mapbox Access Token**:
     ```env
     REACT_APP_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
     ```
4. **Run the project:**
   ```sh
   npm start
   ```
5. Open `http://localhost:3000` in your browser.

## 🤝 Contributing
Feel free to submit issues and pull requests. Contributions are welcome!

## 📜 License
This project is licensed under the MIT License.

---

Made with ❤️ for SRM by Jai Raj Gunnu

