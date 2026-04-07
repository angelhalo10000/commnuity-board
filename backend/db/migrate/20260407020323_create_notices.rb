class CreateNotices < ActiveRecord::Migration[8.1]
  def change
    create_table :notices, id: false do |t|
      t.string :id, primary_key: true, null: false
      t.references :organization, type: :string, null: false, foreign_key: true
      t.string :title, null: false
      t.text :body
      t.string :target_type, null: false, default: "all"
      t.string :status, null: false, default: "draft"
      t.timestamptz :scheduled_at
      t.timestamptz :published_at

      t.timestamps
    end

    add_index :notices, [ :organization_id, :status ]
    add_index :notices, :published_at
  end
end
