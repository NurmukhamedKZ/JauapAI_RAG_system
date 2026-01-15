import fitz  # PyMuPDF
from tqdm import tqdm  # For a progress bar

def extract_text_from_pdf(pdf_path, output_txt_path=None):
    # Open the PDF file
    doc = fitz.open(pdf_path)
    
    full_text = []
    
    print(f"Processing {len(doc)} pages...")
    
    # Iterate through each page
    for page_num in tqdm(range(len(doc))):
        page = doc.load_page(page_num)
        
        # Extract text. "text" mode gives plain text.
        # You can also use "blocks" to get text with coordinates if needed later.
        text = page.get_text("text")
        
        # Optional: Add a page marker to know where text came from
        page_marker = f"\n\n--- Page {page_num + 1} ---\n\n"
        full_text.append(page_marker + text)
        
    joined_text = "".join(full_text)
    
    # Save to file if path is provided
    if output_txt_path:
        with open(output_txt_path, "w", encoding="utf-8") as f:
            f.write(joined_text)
        print(f"Done! Text saved to {output_txt_path}")
        
    return joined_text

# --- Usage ---
pdf_file = "data/Kazakh_history_6.pdf"  # <--- Change this
output_file = "data/book_text.txt"

# Run the function
text_content = extract_text_from_pdf(pdf_file, output_file)

# Check the first 500 characters
print(text_content[:500])