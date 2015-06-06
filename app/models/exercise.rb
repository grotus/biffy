class Exercise < ActiveRecord::Base
	validates :name, :user, presence: true
	validate :unique_name_for_user
  belongs_to :user
  has_many :workout_sets, dependent: :destroy
  has_many :workouts, through: :workout_sets

  def unique_name_for_user
  	if user.exercises.where(name: name).nil? == false
  		errors.add(:name, "already exists")
  	end
  end

end
