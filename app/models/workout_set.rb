class WorkoutSet < ActiveRecord::Base
	default_scope  { order(:order => :asc) }
	validates :workout_exercise, :weight, :reps, presence: true
  belongs_to :workout_exercise
end
