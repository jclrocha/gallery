$(document).ready(function() {
    const API_URL = 'https://65ecdddd0ddee626c9b1012e.mockapi.io/api/PhotoGallery';

    // Function to fetch all photos from the server
    function fetchPhotos() {
        $.get(API_URL, function(data) {
            $('#photo-gallery').empty();
            $.each(data, function(index, photo) {
                $('#photo-gallery').append(`
                    <div class="col-lg-4 col-md-6 mb-4">
                        <div class="card">
                            <img src="${photo.imgUrl}" class="card-img-top" alt="${photo.name}">
                            <div class="card-body">
                                <h5 class="card-title">${photo.name}</h5>
                                <p class="card-text">${photo.details}</p>
                                <button class="btn btn-info btn-sm edit-btn" data-id="${photo.id}">Edit</button>
                                <button class="btn btn-danger btn-sm delete-btn" data-id="${photo.id}">Delete</button>
                            </div>
                        </div>
                    </div>
                `);
            });
        });
    }

    // Fetch all photos on page load
    fetchPhotos();

    // Handle form submission
    $('#photo-form').submit(function(event) {
        event.preventDefault();
        const name = $('#photo-title').val();
        const imgUrl = $('#photo-url').val();
        const details = $('#photo-details').val();
        if (name.trim() !== '' && imgUrl.trim() !== '') {
            $.post(API_URL, { name: name, imgUrl: imgUrl, details: details }, function() {
                $('#photo-title').val('');
                $('#photo-url').val('');
                $('#photo-details').val('');
                fetchPhotos();
            });
        }
    });

    // Handle delete button click
    $(document).on('click', '.delete-btn', function() {
        const id = $(this).data('id');
        $.ajax({
            url: `${API_URL}/${id}`,
            type: 'DELETE',
            success: function() {
                fetchPhotos();
            }
        });
    });

    // Handle edit button click
    $(document).on('click', '.edit-btn', function() {
        const id = $(this).data('id');
        // Fetch photo details to populate the form for editing
        $.get(`${API_URL}/${id}`, function(photo) {
            $('#photo-title').val(photo.name);
            $('#photo-url').val(photo.imgUrl);
            $('#photo-details').val(photo.details);
            
            // Update form submit action to PUT instead of POST for editing
            $('#photo-form').off('submit').submit(function(event) {
                event.preventDefault();
                const newName = $('#photo-title').val();
                const newImgUrl = $('#photo-url').val();
                const newDetails = $('#photo-details').val();
                if (newName.trim() !== '' && newImgUrl.trim() !== '') {
                    $.ajax({
                        url: `${API_URL}/${id}`,
                        type: 'PUT',
                        data: { name: newName, imgUrl: newImgUrl, details: newDetails },
                        success: function() {
                            $('#photo-title').val('');
                            $('#photo-url').val('');
                            $('#photo-details').val('');
                            fetchPhotos();
                        }
                    });
                }
            });
        });
    });
});
