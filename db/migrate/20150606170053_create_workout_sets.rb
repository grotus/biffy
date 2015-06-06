class CreateWorkoutSets < ActiveRecord::Migration
  def change
    create_table :workout_sets do |t|
      t.references :workout, index: true
      t.references :exercise, index: true
      t.float :weight
      t.integer :reps
      t.string :entry_date
      t.boolean :warmup
      t.integer :order
      t.string :comment

      t.timestamps
    end
  end
end
