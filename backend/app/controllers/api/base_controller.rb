module Api
  class BaseController < ApplicationController
    private

    def render_errors(errors, status: :unprocessable_entity)
      render json: { errors: errors }, status: status
    end

    def paginate(scope, page:, per: 10)
      page = [ page.to_i, 1 ].max
      total_count = scope.count
      total_pages = (total_count.to_f / per).ceil

      records = scope.offset((page - 1) * per).limit(per)

      pagination = {
        current_page: page,
        total_pages: total_pages,
        total_count: total_count
      }

      [ records, pagination ]
    end
  end
end
