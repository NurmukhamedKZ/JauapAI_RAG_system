import ocrmypdf

def ocr_book(input_pdf, output_pdf):
    ocrmypdf.ocr(
        input_pdf, 
        output_pdf, 
        deskew=True,         # Straightens crooked pages
        rotate_pages=True,   # Fixes upside down/sideways pages
        optimize=1,          # Compresses the final file
        language="kaz+eng",      # Language code (e.g., 'eng+fra' for multi)
        progress_bar=True,
        force_ocr=True
    )



def extract_text_as_file(input_pdf, output_pdf, text_file):
    ocrmypdf.ocr(
        input_pdf, 
        output_pdf, 
        sidecar=text_file,  # This creates your .txt file
        language="kaz+eng",    # Useful if some pages already have text
        deskew=True,         # Straightens text for better extraction
        force_ocr=True,
        progress_bar=True
    )

# Run it
if __name__ == "__main__":
    extract_text_as_file("Kazakhstan_tarihi_7_atamura_sample copy.pdf", "searchable_book.pdf", "extracted_text.txt")