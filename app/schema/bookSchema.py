def individual_serial(book, include_id=True) -> dict:
    data = {
        "ISBN": book["ISBN"],
        "title": book["Book-Title"],
        "author": book["Book-Author"],
        "yop": book["Year-Of-Publication"],
        "publisher": book["Publisher"],
        "imageS": book["Image-URL-S"],
        "imageM": book["Image-URL-M"],
        "imageL": book["Image-URL-L"]
    }
    if include_id:
        data["id"] = str(book["_id"])
    return data

def list_serial(books, include_id=True) -> list:
    return [individual_serial(book, include_id) for book in books]