class DropWorkoutSetsTable < ActiveRecord::Migration
  def change
  	drop_table :workout_sets
  end
end
