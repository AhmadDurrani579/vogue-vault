import psycopg
from psycopg.rows import dict_row
# 1. Use the async-specific registration helper
from pgvector.psycopg import register_vector_async 
from app.core.config import settings

class DBService:
    def __init__(self):
        self.conn_info = settings.DATABASE_URL
        self.conn = None

    async def connect(self):
        """Initialize the connection and register the vector type safely."""
        if not self.conn or self.conn.closed:
            # Establish the async connection
            self.conn = await psycopg.AsyncConnection.connect(
                self.conn_info, 
                autocommit=True, 
                row_factory=dict_row
            )
            # 2. FIX: Await the async registration
            await register_vector_async(self.conn)
            print("[DB] Async connection & pgvector adapters ready!")

    async def insert_outfit(self, garments: list, embedding: list, occasion: str, score: int, tags: list, image_url: str = None):
        await self.connect()
        async with self.conn.cursor() as cur:
            # register_vector_async handles the conversion of Python lists to pgvector
            await cur.execute("""
                INSERT INTO indexed_outfits (garments, embedding, occasion, score, tags, image_url)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (garments, embedding, occasion, score, tags, image_url))

    async def search_similar(self, embedding: list, occasion: str, limit: int = 20):
        """Search for similar outfits with explicit type casting"""
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

            return await cur.fetchall()