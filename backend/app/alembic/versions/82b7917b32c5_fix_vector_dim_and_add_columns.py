"""fix_vector_dim_and_add_columns

Revision ID: 82b7917b32c5
Revises: 34bb921e0aa7
Create Date: 2026-01-26 12:55:56.252368

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from pgvector.sqlalchemy import Vector

# revision identifiers, used by Alembic.
revision = '82b7917b32c5'
down_revision = '34bb921e0aa7'
branch_labels = None
depends_on = None

def upgrade():

    op.drop_index("ix_document_chunks_embedding", table_name="document_chunks")

    op.execute("DELETE FROM document_chunks")

    op.alter_column('document_chunks', 'embedding',
               type_=Vector(384),
               existing_type=Vector(768),
               nullable=False)

    op.add_column('document_chunks', sa.Column('chunk_index', sa.Integer(), nullable=False))
    op.add_column('document_chunks', sa.Column('updated_at', sa.DateTime(timezone=True), 
                                                server_default=sa.func.now(), nullable=True))
    op.create_index(
        "ix_document_chunks_embedding",
        "document_chunks",
        ["embedding"],
        postgresql_using="ivfflat",
        postgresql_ops={"embedding": "vector_cosine_ops"},
        postgresql_with={"lists": 100},
    )

def downgrade():

    op.drop_index("ix_document_chunks_embedding", table_name="document_chunks")
    op.drop_column('document_chunks', 'updated_at')
    op.drop_column('document_chunks', 'chunk_index')
    op.alter_column('document_chunks', 'embedding',
               type_=Vector(768),
               existing_type=Vector(384),
               nullable=False)

    op.create_index("ix_document_chunks_embedding", "document_chunks", ["embedding"], 
                    postgresql_using="ivfflat", postgresql_ops={"embedding": "vector_cosine_ops"})