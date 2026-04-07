class CreateCirculars < ActiveRecord::Migration[8.1]
  def change
    create_table :circulars, id: false do |t|
      t.string :id, primary_key: true, null: false
      t.references :organization, type: :string, null: false, foreign_key: true
      t.string :title, null: false
      t.string :target_type, null: false, default: "all"
      t.string :status, null: false, default: "draft"
      t.timestamptz :scheduled_at
      t.timestamptz :published_at

      t.timestamps
    end

    add_index :circulars, [ :organization_id, :status ]
    add_index :circulars, :published_at
  end
end
