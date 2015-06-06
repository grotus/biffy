class WorkoutSet < ActiveRecord::Base
	validates :entry_date, :workout, :exercise, :weight, :reps, presence: true
  belongs_to :workout
  belongs_to :exercise
end
