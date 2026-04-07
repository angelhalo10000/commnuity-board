class ApplicationController < ActionController::API
  include ActionController::Cookies

  rescue_from ActiveRecord::RecordNotFound, with: :not_found

  private

  def current_organization
    @current_organization ||= Organization.first!
  end

  def not_found
    render json: { errors: [ "見つかりません" ] }, status: :not_found
  end
end
