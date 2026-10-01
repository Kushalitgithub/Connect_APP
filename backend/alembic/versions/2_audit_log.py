"""add verification audit log

Revision ID: 2_audit_log
Revises: 1_initial_migration
Create Date: 2026-10-01 03:02:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2_audit_log'
down_revision = '1_initial_migration'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'verification_audit_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('guide_id', sa.Integer(), nullable=False),
        sa.Column('admin_id', sa.Integer(), nullable=False),
        sa.Column('action', sa.String(length=20), nullable=False),
        sa.Column('reason', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['admin_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['guide_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_verification_audit_logs_guide_id'), 'verification_audit_logs', ['guide_id'], unique=False)
    op.create_index(op.f('ix_verification_audit_logs_admin_id'), 'verification_audit_logs', ['admin_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_verification_audit_logs_admin_id'), table_name='verification_audit_logs')
    op.drop_index(op.f('ix_verification_audit_logs_guide_id'), table_name='verification_audit_logs')
    op.drop_table('verification_audit_logs')
