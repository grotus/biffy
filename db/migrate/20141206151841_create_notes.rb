class CreateNotes < ActiveRecord::Migration
  def change
    create_table :notes do |t|
      t.text :body
      t.string :entry_date
      t.references :user, index: true

      t.timestamps
    end
  end
end
