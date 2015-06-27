class Exercise < ActiveRecord::Base
	validates :name, :user, presence: true
	validate :unique_name_for_user, :on => :create
  belongs_to :user
  has_many :workout_exercises, dependent: :destroy
  has_many :workouts, through: :workout_exercises
  has_many :workout_sets, through: :workout_exercises

  def unique_name_for_user
  	if user.exercises.where('lower(name) = ?', name.downcase).length > 0
  		errors.add(:name, "already exists")
  	end
  end

end
