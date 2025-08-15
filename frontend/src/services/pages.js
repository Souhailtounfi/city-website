import api from "./api";

export const fetchPage  = slug => api.get(`/pages/${slug}`).then(r=>r.data);
export const createPage = data => api.post(`/pages`, data).then(r=>r.data);
export const updatePage = (slug,data) => api.put(`/pages/${slug}`, data).then(r=>r.data);

export const uploadPageImage = (slug,file) => {
  const fd = new FormData();
  fd.append('image', file);
  return api.post(`/pages/${slug}/gallery`, fd, {
    headers:{'Content-Type':'multipart/form-data'}
  }).then(r=>r.data);
};

export const deletePageImage = (slug,index) =>
  api.delete(`/pages/${slug}/gallery/${index}`).then(r=>r.data);