class CreateFatReadings < ActiveRecord::Migration
  def change
    create_table :fat_readings do |t|
      t.float :percent
      t.datetime :entry_date
      t.references :user, index: true

      t.timestamps
    end
  end
end
