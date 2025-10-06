# UI to Code Generator

A full-stack application that converts UI designs into production-ready React code using AI vision models.

## Project Structure

```
├── project/                    # React frontend (Vite + Tailwind)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── App.jsx            # Main application component
│   │   ├── main.jsx           # Application entry point
│   │   └── index.css          # Global styles with Tailwind
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   └── postcss.config.js      # PostCSS configuration
├── ui-generator-backend/      # Python FastAPI backend
│   ├── services/              # Core services
│   │   ├── vision_service.py  # Google AI Vision integration
│   │   └── parser_service.py  # Code parsing utilities
│   ├── prompts/               # AI prompts
│   │   └── react_tailwind_prompt.txt
│   ├── main.py                # FastAPI application
│   ├── diagnose.py            # Diagnostic utilities
│   └── requirements.txt       # Python dependencies
└── README.md
```

## Features

### Frontend (React + Tailwind)
- **Modern Login UI**: Clean, responsive login form with custom styling
- **Reusable Components**: Modular `Button`, `InputGroup`, and `LoginCard` components
- **Tailwind CSS**: Custom color palette and design system
- **Password Visibility Toggle**: Interactive password field with show/hide functionality
- **Form State Management**: React hooks for form handling

### Backend (FastAPI + AI)
- **Image-to-Code Generation**: Upload UI designs and get React code
- **Google Generative AI**: Uses Gemini Vision model for code generation
- **Code Parsing**: Extracts structured code from AI responses
- **File Generation**: Creates complete React projects with all necessary files
- **ZIP Export**: Downloads generated projects as archives
- **Background Cleanup**: Automatic temporary file cleanup

## Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **Google AI API Key** (for backend functionality)

## Installation & Setup

### Frontend Setup

```bash
cd project
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. **Create virtual environment:**
```bash
cd ui-generator-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Set up environment variables:**
Create a `.env` file in `ui-generator-backend/`:
```env
GOOGLE_API_KEY=your_google_api_key_here
```

4. **Run the backend:**
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check
```
GET /
```
Returns API status.

### Generate Code
```
POST /generate-code
```
**Body:** `multipart/form-data` with image file
**Response:** ZIP file containing generated React project

## Usage

### Frontend
The React app displays a modern login form with:
- Email and password inputs
- Remember me checkbox
- Forgot password link
- Sign in button
- Create account link

### Backend
1. Upload an image of a UI design to `/generate-code`
2. The AI analyzes the image and generates React + Tailwind code
3. Download the generated project as a ZIP file
4. Extract and run the generated code

## Generated Project Structure

The AI generates complete React projects with:
- `package.json` with all dependencies
- Vite configuration
- Tailwind CSS setup
- Component files
- Entry points (`main.jsx`, `App.jsx`)
- Styling files

## Development

### Frontend Development
```bash
cd project
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

### Backend Development
```bash
cd ui-generator-backend
uvicorn main:app --reload  # Development server with auto-reload
```

### Diagnostic Tools
```bash
cd ui-generator-backend
python diagnose.py  # Check Google AI API connectivity
```

## Configuration

### Tailwind Customization
Edit `project/tailwind.config.js` to modify:
- Color palette
- Typography
- Spacing
- Shadows

### AI Prompt Customization
Edit `ui-generator-backend/prompts/react_tailwind_prompt.txt` to modify:
- Code generation instructions
- Output format requirements
- Technology stack preferences

## Dependencies

### Frontend
- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing

### Backend
- **FastAPI**: Web framework
- **Google Generative AI**: Vision model integration
- **Pillow**: Image processing
- **Uvicorn**: ASGI server

## Troubleshooting

### Common Issues

1. **Missing index.html**: Ensure `project/index.html` exists with proper Vite setup
2. **Google API Key**: Verify `GOOGLE_API_KEY` is set in environment
3. **Model Availability**: Run `python diagnose.py` to check available models
4. **CORS Issues**: Backend has permissive CORS for development

### Diagnostic Commands

```bash
# Check Python environment
cd ui-generator-backend
python diagnose.py

# Verify frontend build
cd project
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

## License

This project is open source and available under the MIT License.
