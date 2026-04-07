class CreateBlocks < ActiveRecord::Migration[8.1]
  def change
    create_table :blocks, id: false do |t|
      t.string :id, primary_key: true, null: false
      t.references :organization, type: :string, null: false, foreign_key: true
      t.string :name, null: false
      t.integer :sort_order, null: false, default: 0

      t.timestamps
    end
  end
end
