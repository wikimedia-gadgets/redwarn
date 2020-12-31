# Test Asset Definitions
This is a list of definitions that can help make the filenames of test assets much more clear.

## HTML
- `blank`- A normal blank file.
- `diff` - Simulates the header of a diff view (as presented by Special:Diff).  
  **Self**: User1  
  **Page**: Wikipedia:Sandbox  
  **Older Revision ID**: 12345  
  **Older Revision Time**: 12:00, 1 January 2020
  **Older Revision Summary**: `Older revision here.`  
  **Newer Revision ID**: 67890  
  **Newer Revision Time**: 12:00, 2 January 2020  
  **Older Revision Summary**: `Newer revision here.`  
  **Tags**: `["2017 wikitext editor"]`
  - `onlyrev` - A diff view that only shows one revision (the case in pages with only one revision).
  - `on/no` - The order of the diffs.
    - `on` - The newer revision is on the right side (normal presentation).
    - `no` - The newer revision is on the left side (inversed presentation).
  - `nlatest` - The newer revision is the latest revision.