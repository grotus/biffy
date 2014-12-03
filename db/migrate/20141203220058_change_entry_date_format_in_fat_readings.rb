class ChangeEntryDateFormatInFatReadings < ActiveRecord::Migration
  def up
    change_column :fat_readings, :entry_date, :string
  end

  def down
    change_column :fat_readings, :entry_date, :datetime
  end
end
