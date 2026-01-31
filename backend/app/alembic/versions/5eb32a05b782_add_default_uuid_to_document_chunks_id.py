"""add_default_uuid_to_document_chunks_id

Revision ID: 5eb32a05b782
Revises: 82b7917b32c5
Create Date: 2026-01-26 19:14:27.908373

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5eb32a05b782'
down_revision = '82b7917b32c5'
branch_labels = None
depends_on = None

def upgrade():
    op.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto")
    op.execute(
        """
        ALTER TABLE document_chunks
        ALTER COLUMN id SET DEFAULT gen_random_uuid()
        """
    )

def downgrade():
    op.execute(
        """
        ALTER TABLE document_chunks
        ALTER COLUMN id DROP DEFAULT
        """
    )
