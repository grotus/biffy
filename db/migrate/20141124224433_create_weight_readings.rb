class CreateWeightReadings < ActiveRecord::Migration
  def change
    create_table :weight_readings do |t|
      t.float :weight
      t.datetime :entry_date
      t.references :user, index: true

      t.timestamps
    end
  end
end
