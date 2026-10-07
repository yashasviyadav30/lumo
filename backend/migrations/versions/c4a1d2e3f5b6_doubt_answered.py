"""a group doubt can be marked answered

Revision ID: c4a1d2e3f5b6
Revises: bade515921f1
Create Date: 2026-10-07 07:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c4a1d2e3f5b6'
down_revision: Union[str, Sequence[str], None] = 'bade515921f1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('group_posts', sa.Column('answered_at', sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('group_posts', 'answered_at')
