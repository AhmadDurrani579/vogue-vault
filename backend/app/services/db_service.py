import psycopg2
from app.core.config import settings

class DBService:

    def __init__(self):
        self.conn = psycopg2.connect(settings.DATABASE_URL)
        self.conn.autocommit = True
        print("[DB] Connected to Neon!")

    def insert_outfit(self, garments: list, embedding: list, occasion: str, score: int, tags: list, image_url: str = None):
        with self.conn.cursor() as cur:
            cur.execute("""
                INSERT INTO indexed_outfits (garments, embedding, occasion, score, tags, image_url)
                VALUES (%s, %s::vector, %s, %s, %s, %s)
            """, (garments, embedding, occasion, score, tags, image_url))

    def search_similar(self, embedding: list, occasion: str, limit: int = 20):
        with self.conn.cursor() as cur:
            cur.execute("""
                SELECT garments, score, tags,
                       1 - (embedding <=> %s::vector) AS similarity
                FROM   indexed_outfits
                WHERE  occasion = %s
                ORDER  BY similarity DESC
                LIMIT  %s
            """, (embedding, occasion, limit))

            rows = cur.fetchall()
            return [
                {
                    "garments":   row[0],
                    "score":      row[1],
                    "tags":       row[2],
                    "similarity": round(row[3], 3)
                }
                for row in rows
            ]