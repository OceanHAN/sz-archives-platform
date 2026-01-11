# database/init_db.py
import pymysql
import os

# Database configuration
DB_CONFIG = {
    'host': 'mysql4.sqlpub.com',
    'port': 3309,
    'user': 'szsdag',
    'password': 'kSf4USJrJm5OkuHs',
    'database': 'wszt_szsdag',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

def init_database():
    conn = None
    try:
        # Connect to the database
        print(f"Connecting to database {DB_CONFIG['database']} at {DB_CONFIG['host']}...")
        conn = pymysql.connect(**DB_CONFIG)
        cursor = conn.cursor()
        print("Connected successfully.")

        # Read the schema file
        schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
        print(f"Reading schema from {schema_path}...")
        with open(schema_path, 'r', encoding='utf-8') as f:
            schema_sql = f.read()

        # Execute SQL statements
        # Split statements by semicolon
        statements = schema_sql.split(';')
        
        print("Executing SQL statements...")
        for statement in statements:
            if statement.strip():
                try:
                    cursor.execute(statement)
                except pymysql.Error as err:
                    print(f"Error executing statement: {err}")
                    # print(f"Statement: {statement[:50]}...")
        
        conn.commit()
        print("Database initialized successfully!")

    except pymysql.Error as err:
        print(f"Database error: {err}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if conn:
            conn.close()
            print("Connection closed.")

if __name__ == "__main__":
    init_database()
