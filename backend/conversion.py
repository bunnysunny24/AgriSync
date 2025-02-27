import pandas as pd

# Load .xls file with automatic engine detection
xls_file = "tomaoto.xls"
df = pd.read_excel(xls_file, engine="openpyxl")  # Try this first

# Save as .xlsx
new_file = "tomatos.xlsx"
df.to_excel(new_file, index=False, engine="openpyxl")

print("Conversion successful!")
