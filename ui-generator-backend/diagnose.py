import sys
import os
from dotenv import load_dotenv

def run_diagnostics():
    """Runs a series of checks to debug the environment and API connection."""
    print("--- Python Environment Diagnostic ---")
    print(f"Python Executable Path: {sys.executable}")
    print(f"Python Version: {sys.version}")
    print("-" * 20)

    try:
        import google.generativeai as genai
        print("Successfully imported 'google.generativeai'")
        # __version__ attribute was added in later versions, so we check for it
        if hasattr(genai, '__version__'):
            print(f"Library Version Detected: {genai.__version__}")
        else:
            print("Library Version: Not detectable (likely a very old version).")
        print("-" * 20)
    except ImportError:
        print("\nFATAL ERROR: Could not import 'google.generativeai'.")
        print("It seems it is not installed in the environment that this script is using.")
        print("-" * 20)
        return

    print("--- Google AI API Connection Diagnostic ---")
    load_dotenv()
    api_key = os.getenv("GOOGLE_API_KEY")

    if not api_key:
        print("FATAL ERROR: GOOGLE_API_KEY not found in your .env file.")
        print("-" * 20)
        return

    try:
        genai.configure(api_key=api_key)
        print("API Key configured successfully.")
        
        print("\nFetching list of available models from the API...")
        model_list = []
        for model in genai.list_models():
            # Check if the model supports the 'generateContent' method which is standard now
            if 'generateContent' in model.supported_generation_methods:
                 model_list.append(model.name)

        if model_list:
            print("SUCCESS: Your library and API key are working correctly.")
            print("The following modern models are available to you:")
            for model_name in sorted(model_list):
                print(f"  - {model_name}")
            
            # Check for the specific model we want to use
            if 'models/gemini-1.5-flash-latest' in model_list:
                print("\nCONFIRMED: 'gemini-1.5-flash-latest' is available.")
            else:
                 print("\nWARNING: 'gemini-1.5-flash-latest' was NOT found in the list.")

        else:
            print("\nWARNING: Could not retrieve a list of modern ('generateContent') models.")
            print("This strongly suggests your library version is outdated and hitting an old API endpoint.")

    except Exception as e:
        print(f"\nFATAL ERROR during API call: {e}")
        print("This confirms the connection to the API is failing.")

    print("-" * 20)
    print("--- End of Diagnostic ---")

if __name__ == "__main__":
    run_diagnostics()