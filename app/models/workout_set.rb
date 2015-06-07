class WorkoutSet < ActiveRecord::Base
	validates :workout_exercise, :weight, :reps, presence: true
  belongs_to :workout_exercise
end
