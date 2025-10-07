### Data Source: https://www.kaggle.com/datasets/ruchi798/bookcrossing-dataset - Books Data with Category/Preprocessed_data.csv

from pathlib import Path
from pyspark.sql import SparkSession, Window
from pyspark.sql.functions import length, when, col, desc, row_number, trim, lit, countDistinct
from functools import reduce

spark = SparkSession.builder \
    .appName("Preprocessing data with PySpark") \
    .master("local[*]") \
    .getOrCreate()

sc = spark.sparkContext
sc.setLogLevel("ERROR")

# Define directories
data_path = Path.cwd() / "data" / "Preprocessed_data.csv"
bad_out = Path.cwd() / "data" / "bad_data"
output_dir = Path.cwd() / "data" / "book_cleaned"
output_dir2 = Path.cwd() / "data" / "book_full_method1"
output_dir3 = Path.cwd() / "data" / "book_full_method2"
# print("Data path:" + data_path.as_uri())

df = spark.read.option("header","true") \
               .option("multiline","true") \
               .option("quote",'"') \
               .option("escape",'\\') \
               .option("mode","PERMISSIVE") \
               .option("columnNameOfCorruptRecord","_corrupt_record") \
               .csv(data_path.as_uri())
# df.limit(5).show()

# Filter valid ISBN records
BAD_THRESHOLD = 0.01
regex = "^(?:ISBN(?:-10)?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$)[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$"

cond_isbn_invalid = ~col("isbn").rlike(regex) | col("isbn").isNull() | (length(col("isbn")) < 4)
df_bad = df.filter(cond_isbn_invalid)
df_good = df.filter(~cond_isbn_invalid)
# df_bad.coalesce(1).write.mode("overwrite").option("header", True).option("quote", '"').option("escape",'\\').csv(bad_out.as_uri())
# df_good.coalesce(1).write.mode("overwrite").option("header", True).option("quote", '"').option("escape",'\\').csv(output_dir.as_uri())

# Statistics of the dataset
total = df.count()
bad_count = df_bad.count()
bad_pct = bad_count / total if total else 0
print(f"Total rows: {total}, Bad rows: {bad_count}, Bad percent: {bad_pct:.4f}")
df_isbn = df.select("isbn").distinct()
print("Numbers of unique isbn: " + str(df_isbn.count()))
df_isbn = df_good.select("isbn").distinct()
print("Numbers of unique isbn (cleaned): " + str(df_isbn.count()))
# Total rows: 1031175, Bad rows: 768, Bad percent: 0.0007
# Numbers of unique isbn: 270181
# Numbers of unique isbn (cleaned): 269626


drop_cols = ["id", "user_id", "location", "age", "rating", "Language", "city", "state", "country"]
df_droped = df_good.drop(*drop_cols)

# books_sel = ["isbn", "book_title", "book_author", "year_of_publication", "publisher", "Summary", "Category"]
# df_sel = df_good.select(*books_sel)

df_summary = df_droped.filter((col("Summary").isNotNull()) & (col("Summary") != "") & (col("Summary") != "9"))
df_summary_cate = df_summary.filter((col("Category").isNotNull()) & (col("Category") != "") & (col("Category") != "9"))

# Method 1:
print("=====================================================")
print("Method 1: ")
df_books = df_droped.distinct()
# df_books.limit(5).show()
print("Total records: " + str(df_droped.count()) + "\n" + "Quantity of books: " + str(df_books.count()))
df_books = df_summary.distinct()
# df_books.limit(5).show()
print("Total records (Have full Summary): " + str(df_summary.count()) + "\n" + "Quantity of books: " + str(df_books.count()))
df_books.coalesce(1).write.mode("overwrite").option("header", True).csv(output_dir.as_uri())

df_books = df_summary_cate.distinct()
# df_books.limit(5).show()
print("Total records (Have full Summary and Category): " + str(df_summary_cate.count()) + "\n" + "Quantity of books: " + str(df_books.count()))
df_books.coalesce(1).write.mode("overwrite").option("header", True).csv(output_dir2.as_uri())

# Method 2:
print("=====================================================")
print("Method Another 2: ")
books_cols = ["book_title", "book_author", "year_of_publication", "publisher", "Summary", "Category"]
exprs = [when(col(c).isNotNull() & (col(c) != ""), 1).otherwise(0) for c in books_cols]
completeness_expr = reduce(lambda a, b: a + b, exprs, lit(0))
df_scored = df_summary_cate.withColumn("completeness", completeness_expr)

w = Window.partitionBy("isbn").orderBy(desc("completeness"), col("Summary").asc())
df_representative = (
    df_scored.withColumn("rn", row_number().over(w))
            .filter(col("rn") == 1)
            .drop("rn", "completeness")
)

# df_representative.limit(5).show()
print("Total records (Have full summary and category - method 2): " + str(df_summary_cate.count()) + "\n" + "Quantity of books: " + str(df_representative.count()))
df_representative.coalesce(1).write.mode("overwrite").option("header", True).csv(output_dir3.as_uri())
