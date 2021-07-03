"""empty message

Revision ID: 7842beff9d70
Revises: 
Create Date: 2021-07-04 01:24:40.274422

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '7842beff9d70'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('books',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=1000), nullable=True),
    sa.Column('isbn', sa.BigInteger(), nullable=True),
    sa.Column('imagepath', sa.String(length=100), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('inventory',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('bookId', sa.Integer(), nullable=True),
    sa.Column('ownerId', sa.Integer(), nullable=True),
    sa.Column('price', sa.Integer(), nullable=True),
    sa.Column('condition', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users',
    sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('googleId', sa.VARCHAR(length=255), nullable=True),
    sa.Column('email', sa.String(length=254), nullable=True),
    sa.Column('name', sa.String(length=70), nullable=True),
    sa.Column('profilePic', sa.String(length=100), nullable=True),
    sa.Column('cky', sa.Boolean(), nullable=True),
    sa.Column('cash', sa.Boolean(), nullable=True),
    sa.Column('octopus', sa.Boolean(), nullable=True),
    sa.Column('payme', sa.Boolean(), nullable=True),
    sa.Column('tapngo', sa.Boolean(), nullable=True),
    sa.Column('bankTransfer', sa.Boolean(), nullable=True),
    sa.Column('wechatPay', sa.Boolean(), nullable=True),
    sa.Column('alipay', sa.Boolean(), nullable=True),
    sa.Column('eCheque', sa.Boolean(), nullable=True),
    sa.Column('buyer', sa.Boolean(), nullable=True),
    sa.Column('seller', sa.Boolean(), nullable=True),
    sa.Column('negotiable', sa.Boolean(), nullable=True),
    sa.Column('inSchoolExchange', sa.Boolean(), nullable=True),
    sa.Column('meetup', sa.Boolean(), nullable=True),
    sa.Column('delivery', sa.Boolean(), nullable=True),
    sa.Column('public', sa.Boolean(), nullable=True),
    sa.Column('discord', sa.String(), nullable=True),
    sa.Column('instagram', sa.String(length=30), nullable=True),
    sa.Column('phone', sa.String(), nullable=True),
    sa.Column('whatsapp', sa.Boolean(), nullable=True),
    sa.Column('signal', sa.Boolean(), nullable=True),
    sa.Column('telegram', sa.Boolean(), nullable=True),
    sa.Column('customContactInfo', sa.String(length=200), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_googleId'), 'users', ['googleId'], unique=True)
    op.create_index(op.f('ix_users_name'), 'users', ['name'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_users_name'), table_name='users')
    op.drop_index(op.f('ix_users_googleId'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
    op.drop_table('inventory')
    op.drop_table('books')
    # ### end Alembic commands ###
