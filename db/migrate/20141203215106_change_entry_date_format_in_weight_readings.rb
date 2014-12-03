class ChangeEntryDateFormatInWeightReadings < ActiveRecord::Migration
  def up
    change_column :weight_readings, :entry_date, :string
  end

  def down
    change_column :weight_readings, :entry_date, :datetime
  end
end
