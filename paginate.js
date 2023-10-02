  <!-- paginate -->
    <div class="pagination">
      <% if (data.page> 1) { %>
      <a href="?page=1" class="prev">&laquo; First</a>
      <a href="?page=<%= data.page - 1 %>" class="prev">&lsaquo; Prev</a>
      <% } %>

      <% let start=Math.max(1, data.page - 2) %>
      <% let end=Math.min(data.total_page, data.page + 2) %>

      <% if (start> 1) { %>
      <span class="ellipsis">...</span>
      <% } %>

      <% for (let i=start; i <=end; i++) { %>
      <% if (i===data.page) { %>
      <a href="#" class="active">
        <%= i %>
      </a>
      <% } else { %>
      <a href="?page=<%= i %>">
        <%= i %>
      </a>
      <% } %>
      <% } %>

      <% if (end < data.total_page) { %>
      <span class="ellipsis">...</span>
      <% } %>

      <% if (data.page < data.total_page) { %>
      <a href="?page=<%= data.page + 1 %>" class="next">Next &rsaquo;</a>
      <a href="?page=<%= data.total_page %>" class="next">Last &raquo;</a>
      <% } %>
    </div>