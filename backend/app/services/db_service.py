import psycopg
from psycopg.rows import dict_row
from pgvector.psycopg import register_vector_async
from app.core.config import settings


class DBService:

    def __init__(self):
        self.conn_info = settings.DATABASE_URL
        self.conn = None

    async def connect(self):
        if not self.conn or self.conn.closed:
            self.conn = await psycopg.AsyncConnection.connect(
                self.conn_info,
                autocommit=True,
                row_factory=dict_row
            )
            await register_vector_async(self.conn)
            print("[DB] Connected!")

    async def search_similar(self, embedding: list, occasion: str, limit: int = 20) -> list:
        await self.connect()
        async with self.conn.cursor() as cur:
            await cur.execute("""
                SELECT garments, score, tags, image_url,
                       1 - (embedding <=> %s::vector) AS similarity
                FROM   indexed_outfits
                WHERE  occasion = %s
                ORDER  BY similarity DESC
                LIMIT  %s
            """, (embedding, occasion, limit))
            rows = await cur.fetchall()
            return [
                {
                    "garments":   row["garments"],
                    "score":      row["score"],
                    "tags":       row["tags"],
                    "image_url":  row["image_url"],
                    "similarity": round(float(row["similarity"]), 3)
                }
                for row in rows
            ]

    async def insert_outfit(self, garments, embedding, occasion, score, tags, image_url=None):
        await self.connect()
        async with self.conn.cursor() as cur:
            await cur.execute("""
                INSERT INTO indexed_outfits (garments, embedding, occasion, score, tags, image_url)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (garments, embedding, occasion, score, tags, image_url))