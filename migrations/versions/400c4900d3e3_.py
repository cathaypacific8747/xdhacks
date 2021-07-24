"""empty message

Revision ID: 400c4900d3e3
Revises: 
Create Date: 2021-07-23 23:19:59.859296

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '400c4900d3e3'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('offers',
    sa.Column('offerid', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('listingid', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('buyerid', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('sellerid', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('buyerpublic', sa.Boolean(), nullable=True),
    sa.Column('sellerpublic', sa.Boolean(), nullable=True),
    sa.Column('deleted', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['buyerid'], ['users.userid'], ),
    sa.ForeignKeyConstraint(['listingid'], ['listings.listingid'], ),
    sa.ForeignKeyConstraint(['sellerid'], ['users.userid'], ),
    sa.PrimaryKeyConstraint('offerid')
    )
    op.create_index(op.f('ix_offers_buyerid'), 'offers', ['buyerid'], unique=False)
    op.create_index(op.f('ix_offers_listingid'), 'offers', ['listingid'], unique=False)
    op.create_index(op.f('ix_offers_offerid'), 'offers', ['offerid'], unique=False)
    op.create_index(op.f('ix_offers_sellerid'), 'offers', ['sellerid'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_offers_sellerid'), table_name='offers')
    op.drop_index(op.f('ix_offers_offerid'), table_name='offers')
    op.drop_index(op.f('ix_offers_listingid'), table_name='offers')
    op.drop_index(op.f('ix_offers_buyerid'), table_name='offers')
    op.drop_table('offers')
    # ### end Alembic commands ###