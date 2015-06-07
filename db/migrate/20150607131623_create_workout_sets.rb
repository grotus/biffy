class CreateWorkoutSets < ActiveRecord::Migration
  def change
    create_table :workout_sets do |t|
      t.references :workout_exercise, index: true
      t.float :weight
      t.integer :reps
      t.boolean :warmup
      t.integer :order
      t.string :comment

      t.timestamps
    end
  end
end
