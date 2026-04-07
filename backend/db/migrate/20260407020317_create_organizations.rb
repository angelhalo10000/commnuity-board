class CreateOrganizations < ActiveRecord::Migration[8.1]
  def change
    create_table :organizations, id: false do |t|
      t.string :id, primary_key: true, null: false
      t.string :name, null: false
      t.string :member_password_digest, null: false
      t.string :leader_password_digest, null: false
      t.string :admin_password_digest, null: false

      t.timestamps
    end
  end
end
