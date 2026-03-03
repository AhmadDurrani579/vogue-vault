import psycopg
from psycopg.rows import dict_row
from pgvector.psycopg import register_vector
from app.core.config import settings

class DBService:
    def __init__(self):
        # We use a connection string for Neon
        self.conn_info = settings.DATABASE_URL
        self.conn = None

    async def connect(self):
        """Initialize the connection and register the vector type."""
        if not self.conn or self.conn.closed:
            # dict_row makes results look like {'column': value} automatically
            self.conn = await psycopg.AsyncConnection.connect(
                self.conn_info, 
                autocommit=True, 
                row_factory=dict_row
            )
            # Mandatory for pgvector to understand the 'vector' type
            await register_vector(self.conn)
            print("[DB] Async connection to Neon established!")

    async def insert_outfit(self, garments: list, embedding: list, occasion: str, score: int, tags: list, image_url: str = None):
        await self.connect()
        async with self.conn.cursor() as cur:
            await cur.execute("""
                INSERT INTO indexed_outfits (garments, embedding, occasion, score, tags, image_url)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (garments, embedding, occasion, score, tags, image_url))

    async def search_similar(self, embedding: list, occasion: str, limit: int = 20):
        await self.connect()
        async with self.conn.cursor() as cur:
            # Using <=> for cosine distance (lower is closer)
            # We convert it to similarity: 1 - distance
            await cur.execute("""
                SELECT garments, score, tags, image_url,
                       1 - (embedding <=> %s) AS similarity
                FROM   indexed_outfits
                WHERE  occasion = %s
                ORDER  BY similarity DESC
                LIMIT  %s
            """, (embedding, occasion, limit))

            return await cur.fetchall()