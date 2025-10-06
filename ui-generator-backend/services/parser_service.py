import re

def parse_generated_code(raw_text: str) -> dict:
    """
    Parses the raw markdown text from the AI model into a dictionary
    of filenames and their code content.

    Args:
        raw_text: The raw markdown text from the model.

    Returns:
        A dictionary where keys are file paths and values are code content.
    """
    # Regex to find all code blocks with the specified format
    # ```<language>:<filepath>
    # (code)
    # ```
    pattern = r"```(?:\w*):(.+?)\n([\s\S]+?)```"
    
    matches = re.findall(pattern, raw_text)
    
    # Clean up file paths and code content
    code_files = {filepath.strip(): code.strip() for filepath, code in matches}
    
    return code_files