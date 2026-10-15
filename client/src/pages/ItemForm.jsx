import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'

const defaults = { title: '', description: '', category: 'other', status: 'lost', location: '' }

export default function ItemForm() {
  const nav = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState(defaults)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api.get(`/items/${id}`)
      .then(res => {
        const { title, status, category, location, description } = res.data
        setForm({ title, status, category, location: location || '', description: description || '' })
      })
      .catch(err => setError(err?.response?.data?.message || 'Failed to load item'))
  }, [id])

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      if (id) {
        await api.patch(`/items/${id}`, form)
      } else {
        await api.post('/items', form)
      }
      nav('/items')
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="max-w-lg mx-auto card">
      <h1 className="text-xl font-semibold mb-4">{id ? 'Edit' : 'Report'} Item</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="input" name="title" placeholder="Title" value={form.title} onChange={onChange} required />
        <select className="input" name="status" value={form.status} onChange={onChange}>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
          <option value="claimed">Claimed</option>
        </select>
        <select className="input" name="category" value={form.category} onChange={onChange}>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="documents">Documents</option>
          <option value="accessories">Accessories</option>
          <option value="other">Other</option>
        </select>
        <input className="input" name="location" placeholder="Location (optional)" value={form.location} onChange={onChange} />
        <textarea className="input" name="description" placeholder="Description (optional)" value={form.description} onChange={onChange} rows={3} />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="btn" type="submit">Save</button>
      </form>
    </div>
  )
}
