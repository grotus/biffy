class CreateWorkouts < ActiveRecord::Migration
  def change
    create_table :workouts do |t|
      t.references :user, index: true
      t.string :entry_date
      t.string :comment

      t.timestamps
    end
  end
end
